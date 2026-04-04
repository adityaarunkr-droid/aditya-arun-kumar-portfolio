import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface Contact2Props {
  title?: string
  description?: string
  /** Recipient for the mailto draft (not shown in the UI). */
  email?: string
}

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

const MESSAGE_MIN = 10

const initialValues = {
  firstName: '',
  lastName: '',
  formEmail: '',
  subject: '',
  message: '',
}

type FieldKey = 'firstName' | 'lastName' | 'formEmail' | 'subject' | 'message'

type FormValues = typeof initialValues

function fieldError(key: FieldKey, values: FormValues): string | null {
  switch (key) {
    case 'firstName':
      return values.firstName.trim() ? null : 'First name is required'
    case 'lastName':
      return values.lastName.trim() ? null : 'Last name is required'
    case 'formEmail': {
      const v = values.formEmail.trim()
      if (!v) return 'Please enter a valid email address'
      if (!EMAIL_RE.test(v)) return 'Please enter a valid email address'
      return null
    }
    case 'subject':
      return values.subject.trim() ? null : 'Subject is required'
    case 'message': {
      const v = values.message.trim()
      if (!v) return 'Message is required'
      if (v.length < MESSAGE_MIN) return 'Message must be at least 10 characters'
      return null
    }
    default:
      return null
  }
}

function allValid(values: FormValues): boolean {
  const keys: FieldKey[] = [
    'firstName',
    'lastName',
    'formEmail',
    'subject',
    'message',
  ]
  return keys.every((k) => fieldError(k, values) === null)
}

function inputRingClass(touched: boolean, err: string | null): string {
  if (!touched) return ''
  if (err) {
    return 'border-destructive focus-visible:ring-destructive/40 aria-invalid:border-destructive'
  }
  return 'border-emerald-600/45 focus-visible:ring-emerald-600/30'
}

export function Contact2({
  title = 'Open to opportunities',
  description =
    "If my background matches what you're looking for, I'd be glad to connect. Share a few details and I'll get back to you as soon as possible.",
  email = 'adityaarunkr@gmail.com',
}: Contact2Props) {
  const [values, setValues] = React.useState(initialValues)
  const [touched, setTouched] = React.useState<Partial<Record<FieldKey, boolean>>>(
    {},
  )
  const [submitAttempted, setSubmitAttempted] = React.useState(false)
  const [honeypot, setHoneypot] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [mailtoHref, setMailtoHref] = React.useState<string | null>(null)

  const err = (key: FieldKey) => fieldError(key, values)
  const showErr = (key: FieldKey) =>
    (submitAttempted || touched[key]) && err(key) !== null

  const valid = allValid(values)

  const onField =
    (key: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }))
    }

  const blur = (key: FieldKey) => () => {
    setTouched((t) => ({ ...t, [key]: true }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (honeypot.trim() !== '') {
      setLoading(true)
      window.setTimeout(() => {
        setLoading(false)
        setSuccess(true)
        setMailtoHref(null)
      }, 600)
      return
    }

    if (!allValid(values)) return

    setTouched({
      firstName: true,
      lastName: true,
      formEmail: true,
      subject: true,
      message: true,
    })

    const subj = encodeURIComponent(values.subject.trim())
    const body = encodeURIComponent(
      `Name: ${values.firstName.trim()} ${values.lastName.trim()}\nReply-to: ${values.formEmail.trim()}\n\n${values.message.trim()}`,
    )
    const href = `mailto:${email}?subject=${subj}&body=${body}`

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setMailtoHref(href)
    }, 550)
  }

  const resetForm = () => {
    setValues(initialValues)
    setTouched({})
    setSubmitAttempted(false)
    setSuccess(false)
    setMailtoHref(null)
    setHoneypot('')
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container max-w-full px-0 sm:px-4">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-8 sm:gap-12 lg:gap-16">
          <div className="mx-auto w-full max-w-lg px-3 text-center sm:max-w-xl sm:px-1">
            <h3 className="mb-3 text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>

          <div className="mx-auto w-full max-w-screen-md space-y-4 px-3 sm:px-0">
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              This form opens your email app — nothing is stored on this site.
            </p>

            {success && (
              <div
                className="rounded-lg border border-emerald-600/35 bg-emerald-950/25 px-4 py-3 text-sm text-emerald-100"
                role="status"
                aria-live="polite"
              >
                {mailtoHref ? (
                  <>
                    <p className="font-medium text-emerald-50">
                      You&apos;re all set — finish sending in your email app.
                    </p>
                    <p className="mt-2 text-emerald-100/85">
                      Your draft is ready. If your client didn&apos;t open
                      automatically, use the button below.
                    </p>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <Button asChild className="w-full sm:w-auto">
                        <a href={mailtoHref}>Open email app</a>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-emerald-600/40 bg-transparent text-emerald-100 hover:bg-emerald-950/40 sm:w-auto"
                        onClick={resetForm}
                      >
                        Send another message
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-emerald-100/90">Thanks — your message was received.</p>
                )}
              </div>
            )}

            {!success && (
              <form
                className="relative flex flex-col gap-5 rounded-lg border border-border bg-card/30 p-5 backdrop-blur-sm sm:gap-6 sm:p-8 md:p-10"
                onSubmit={handleSubmit}
                noValidate
                aria-busy={loading}
              >
                {/* Honeypot — hidden from users; bots often fill it */}
                <div
                  className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden opacity-0"
                  aria-hidden="true"
                >
                  <label htmlFor="contact-website">Website</label>
                  <input
                    type="text"
                    id="contact-website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="contact-firstname">
                      First Name{' '}
                      <span className="text-destructive" aria-hidden="true">
                        *
                      </span>
                    </Label>
                    <Input
                      type="text"
                      id="contact-firstname"
                      name="firstname"
                      placeholder="First name"
                      value={values.firstName}
                      onChange={onField('firstName')}
                      onBlur={blur('firstName')}
                      autoComplete="given-name"
                      aria-invalid={showErr('firstName')}
                      aria-describedby={
                        showErr('firstName') ? 'err-firstname' : undefined
                      }
                      className={cn(
                        inputRingClass(
                          !!touched.firstName || submitAttempted,
                          err('firstName'),
                        ),
                      )}
                    />
                    {showErr('firstName') && (
                      <p
                        id="err-firstname"
                        className="text-xs text-destructive"
                        role="alert"
                      >
                        {err('firstName')}
                      </p>
                    )}
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="contact-lastname">
                      Last Name{' '}
                      <span className="text-destructive" aria-hidden="true">
                        *
                      </span>
                    </Label>
                    <Input
                      type="text"
                      id="contact-lastname"
                      name="lastname"
                      placeholder="Last name"
                      value={values.lastName}
                      onChange={onField('lastName')}
                      onBlur={blur('lastName')}
                      autoComplete="family-name"
                      aria-invalid={showErr('lastName')}
                      aria-describedby={
                        showErr('lastName') ? 'err-lastname' : undefined
                      }
                      className={cn(
                        inputRingClass(
                          !!touched.lastName || submitAttempted,
                          err('lastName'),
                        ),
                      )}
                    />
                    {showErr('lastName') && (
                      <p
                        id="err-lastname"
                        className="text-xs text-destructive"
                        role="alert"
                      >
                        {err('lastName')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="contact-email">
                    Email{' '}
                    <span className="text-destructive" aria-hidden="true">
                      *
                    </span>
                  </Label>
                  <Input
                    type="email"
                    id="contact-email"
                    name="email"
                    placeholder="you@example.com"
                    value={values.formEmail}
                    onChange={onField('formEmail')}
                    onBlur={blur('formEmail')}
                    autoComplete="email"
                    aria-invalid={showErr('formEmail')}
                    aria-describedby={
                      showErr('formEmail') ? 'err-email' : undefined
                    }
                    className={cn(
                      inputRingClass(
                        !!touched.formEmail || submitAttempted,
                        err('formEmail'),
                      ),
                    )}
                  />
                  {showErr('formEmail') && (
                    <p id="err-email" className="text-xs text-destructive" role="alert">
                      {err('formEmail')}
                    </p>
                  )}
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="contact-subject">
                    Subject{' '}
                    <span className="text-destructive" aria-hidden="true">
                      *
                    </span>
                  </Label>
                  <Input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    placeholder="What is this about?"
                    value={values.subject}
                    onChange={onField('subject')}
                    onBlur={blur('subject')}
                    aria-invalid={showErr('subject')}
                    aria-describedby={
                      showErr('subject') ? 'err-subject' : undefined
                    }
                    className={cn(
                      inputRingClass(
                        !!touched.subject || submitAttempted,
                        err('subject'),
                      ),
                    )}
                  />
                  {showErr('subject') && (
                    <p
                      id="err-subject"
                      className="text-xs text-destructive"
                      role="alert"
                    >
                      {err('subject')}
                    </p>
                  )}
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="contact-message">
                    Message{' '}
                    <span className="text-destructive" aria-hidden="true">
                      *
                    </span>
                  </Label>
                  <Textarea
                    placeholder="Share context, timeline, or links…"
                    id="contact-message"
                    name="message"
                    value={values.message}
                    onChange={onField('message')}
                    onBlur={blur('message')}
                    aria-invalid={showErr('message')}
                    aria-describedby={
                      showErr('message') ? 'err-message' : undefined
                    }
                    className={cn(
                      inputRingClass(
                        !!touched.message || submitAttempted,
                        err('message'),
                      ),
                    )}
                  />
                  {showErr('message') && (
                    <p
                      id="err-message"
                      className="text-xs text-destructive"
                      role="alert"
                    >
                      {err('message')}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!valid || loading}
                  aria-busy={loading}
                >
                  {loading ? 'Preparing…' : 'Send message'}
                </Button>

                {loading ? (
                  <div
                    className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end gap-2 rounded-lg bg-background/35 pb-8 backdrop-blur-[2px] dark:bg-black/40 sm:pb-10"
                    aria-hidden
                  >
                    <Skeleton className="h-10 w-[min(100%,14rem)] rounded-md shadow-sm" />
                    <Skeleton className="h-2.5 w-24 rounded-full opacity-80" />
                  </div>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
