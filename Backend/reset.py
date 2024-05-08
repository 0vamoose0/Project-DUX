import smtplib, ssl

def send_email(username, email, reset_code):
    port = 465
    smtp_server = "smtp.gmail.com"
    # ===================================================================
    # TODO: Sign up the official email for sending an receving the email.
    sender_email = ""
    password = ""
    # ===================================================================

    receiver_email = email
    reset_code = reset_code()
    # Generate a random 8 digit code
    
    
    message = f"""\Dear {username},
    The reset code for your account is: {reset_code}
    Enter this code in the app to reset your password.
    Do not share this code with anyone.

    DO NOT REPLY. This is an automated message.
    Kind Regards,
    DUX Team
    """

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message)
