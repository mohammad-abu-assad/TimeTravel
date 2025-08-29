import os, smtplib
from email.message import EmailMessage

MAIL_HOST = os.getenv("MAIL_HOST")
MAIL_PORT = int(os.getenv("MAIL_PORT", "587"))
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM", "TimeTravel <no-reply@timetravel.local>")

def send_email(to: str, subject: str, text: str) -> None:
    # Dev fallback: print to console if SMTP not configured
    if not (MAIL_HOST and MAIL_USERNAME and MAIL_PASSWORD):
        print(f"\n[DEV EMAIL]\nTo: {to}\nSubject: {subject}\n\n{text}\n")
        return

    msg = EmailMessage()
    msg["From"] = MAIL_FROM
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(text)

    with smtplib.SMTP(MAIL_HOST, MAIL_PORT) as smtp:
        smtp.starttls()
        smtp.login(MAIL_USERNAME, MAIL_PASSWORD)
        smtp.send_message(msg)
