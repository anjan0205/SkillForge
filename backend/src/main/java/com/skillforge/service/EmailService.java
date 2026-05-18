package com.skillforge.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * EmailService
 * ============
 * Sends transactional emails for SkillForge LMS events.
 *
 * Supported email providers (configure via application.properties):
 *   - Resend  (recommended): set EMAIL_PROVIDER=resend, RESEND_API_KEY=re_xxx
 *   - SendGrid: set EMAIL_PROVIDER=sendgrid, SENDGRID_API_KEY=SG.xxx
 *
 * All emails are sent asynchronously (@Async) so they don't block HTTP responses.
 * Email sending is DISABLED by default (EMAIL_ENABLED=false).
 *
 * -----------------------------------------------------------------------
 * TO ENABLE EMAIL:
 *   1. Choose a provider (Resend or SendGrid)
 *   2. Uncomment the SMTP config block in application.properties
 *   3. Set EMAIL_ENABLED=true
 *   4. Set EMAIL_FROM to a verified sender address
 * -----------------------------------------------------------------------
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    // -------------------------------------------------------------------------
    // CONFIG — injected from application.properties / environment variables
    // -------------------------------------------------------------------------

    /** Set EMAIL_ENABLED=true once your SMTP provider is configured */
    @Value("${email.enabled:false}")
    private boolean emailEnabled;

    /** Verified sender address — e.g. noreply@yourdomain.com */
    @Value("${email.from:noreply@skillforge.dev}")
    private String fromAddress;

    /** Display name shown in the "From" field */
    @Value("${email.from-name:SkillForge LMS}")
    private String fromName;

    /** Active provider for logging: "resend" | "sendgrid" | "none" */
    @Value("${email.provider:none}")
    private String emailProvider;

    // -------------------------------------------------------------------------
    // ADD YOUR SMTP CREDENTIALS:
    //   For Resend:   set RESEND_API_KEY in environment → spring.mail.password
    //   For SendGrid: set SENDGRID_API_KEY in environment → spring.mail.password
    //   Then uncomment the matching SMTP block in application.properties
    // -------------------------------------------------------------------------
    @Autowired(required = false)  // optional — null if spring.mail.* not configured
    private JavaMailSender mailSender;

    // =========================================================================
    // EMAIL TEMPLATES
    // =========================================================================

    /**
     * Sent immediately after a user successfully registers.
     *
     * @param toEmail   recipient email address
     * @param firstName user's first name (for personalization)
     */
    @Async
    public void sendWelcomeEmail(String toEmail, String firstName) {
        String subject = "Welcome to SkillForge, " + firstName + "! 🚀";
        String html = """
            <div style="font-family: 'Geist', Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #fdfaf9; border-radius: 16px; overflow: hidden;">
              <div style="background: #5c1d24; padding: 40px 32px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -0.5px;">SkillForge</h1>
                <p style="color: rgba(255,255,255,0.75); margin: 8px 0 0; font-size: 14px;">Precision-Engineered Learning</p>
              </div>
              <div style="padding: 40px 32px;">
                <h2 style="color: #2c1214; font-size: 22px; margin: 0 0 12px;">Welcome aboard, %s! 👋</h2>
                <p style="color: #5c4c4e; line-height: 1.6; margin: 0 0 24px;">
                  Your SkillForge account is ready. Explore our curated executive courses and start
                  building the skills that matter most.
                </p>
                <a href="http://localhost:5173/catalog"
                   style="display: inline-block; background: #5c1d24; color: #fff; padding: 14px 28px;
                          border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px;">
                  Browse Courses →
                </a>
              </div>
              <div style="background: #f4e6e2; padding: 20px 32px; text-align: center;">
                <p style="color: #5c4c4e; font-size: 12px; margin: 0;">
                  © 2026 SkillForge LMS. You received this because you created an account.
                </p>
              </div>
            </div>
            """.formatted(firstName);

        sendEmail(toEmail, subject, html);
    }

    /**
     * Sent when a student successfully enrolls in a course.
     *
     * @param toEmail    student's email
     * @param firstName  student's first name
     * @param courseTitle title of the course they enrolled in
     * @param courseId   used to build the direct course link
     */
    @Async
    public void sendEnrollmentEmail(String toEmail, String firstName, String courseTitle, String courseId) {
        String subject = "You're enrolled in: " + courseTitle;
        String html = """
            <div style="font-family: 'Geist', Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #fdfaf9; border-radius: 16px; overflow: hidden;">
              <div style="background: #5c1d24; padding: 40px 32px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">SkillForge</h1>
              </div>
              <div style="padding: 40px 32px;">
                <h2 style="color: #2c1214; font-size: 22px; margin: 0 0 8px;">Enrollment Confirmed! 🎉</h2>
                <p style="color: #5c4c4e; line-height: 1.6; margin: 0 0 8px;">Hi %s,</p>
                <p style="color: #5c4c4e; line-height: 1.6; margin: 0 0 24px;">
                  You're now enrolled in <strong style="color: #5c1d24;">%s</strong>.
                  Head to your dashboard to start learning!
                </p>
                <a href="http://localhost:5173/courses/%s"
                   style="display: inline-block; background: #5c1d24; color: #fff; padding: 14px 28px;
                          border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px;">
                  Start Learning →
                </a>
              </div>
              <div style="background: #f4e6e2; padding: 20px 32px; text-align: center;">
                <p style="color: #5c4c4e; font-size: 12px; margin: 0;">© 2026 SkillForge LMS.</p>
              </div>
            </div>
            """.formatted(firstName, courseTitle, courseId);

        sendEmail(toEmail, subject, html);
    }

    /**
     * Placeholder: Password reset email.
     * TODO: Implement forgot-password flow with token generation.
     *
     * @param toEmail    user's email
     * @param resetLink  the password reset URL containing a secure token
     */
    @Async
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        String subject = "Reset your SkillForge password";
        String html = """
            <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #fdfaf9; border-radius: 16px; overflow: hidden;">
              <div style="background: #5c1d24; padding: 40px 32px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0;">SkillForge</h1>
              </div>
              <div style="padding: 40px 32px;">
                <h2 style="color: #2c1214;">Reset Your Password</h2>
                <p style="color: #5c4c4e; line-height: 1.6;">
                  Click the button below to reset your password. This link expires in 1 hour.
                </p>
                <a href="%s"
                   style="display: inline-block; background: #5c1d24; color: #fff; padding: 14px 28px;
                          border-radius: 12px; text-decoration: none; font-weight: 700;">
                  Reset Password →
                </a>
                <p style="color: #5c4c4e; font-size: 13px; margin-top: 24px;">
                  If you didn't request this, you can safely ignore this email.
                </p>
              </div>
            </div>
            """.formatted(resetLink);

        sendEmail(toEmail, subject, html);
    }

    // =========================================================================
    // INTERNAL SEND METHOD
    // =========================================================================

    /**
     * Core method: builds a MIME message and sends it.
     * If email is disabled or mailSender is not configured, it logs a warning instead.
     */
    private void sendEmail(String to, String subject, String htmlBody) {
        if (!emailEnabled) {
            logger.info("[EMAIL DISABLED] Would send '{}' to {}", subject, to);
            logger.info("  → Set EMAIL_ENABLED=true and configure SMTP to enable real email delivery.");
            return;
        }

        if (mailSender == null) {
            logger.warn("[EMAIL] JavaMailSender not configured. Skipping email to {}", to);
            logger.warn("  → Uncomment the spring.mail.* block in application.properties and provide credentials.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);  // true = HTML email

            mailSender.send(message);
            logger.info("[EMAIL] Sent '{}' to {} via {}", subject, to, emailProvider);

        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            // Log the failure but do NOT throw — email failure should never break core features
            logger.error("[EMAIL] Failed to send '{}' to {}: {}", subject, to, e.getMessage());
        }
    }
}
