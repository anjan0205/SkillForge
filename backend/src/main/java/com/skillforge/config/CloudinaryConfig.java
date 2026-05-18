package com.skillforge.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cloudinary Configuration
 * ========================
 * Wires the Cloudinary SDK bean used for file uploads (images, videos, documents).
 *
 * Required environment variables:
 *   CLOUDINARY_CLOUD_NAME  — your Cloudinary cloud name
 *   CLOUDINARY_API_KEY     — your Cloudinary API key
 *   CLOUDINARY_API_SECRET  — your Cloudinary API secret
 *   CLOUDINARY_ENABLED     — set to "true" to activate uploads (default: false)
 *
 * Get credentials at: https://cloudinary.com → Dashboard
 */
@Configuration
public class CloudinaryConfig {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryConfig.class);

    // -------------------------------------------------------------------------
    // ADD YOUR CLOUDINARY CREDENTIALS VIA ENVIRONMENT VARIABLES:
    //   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
    // -------------------------------------------------------------------------
    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Value("${cloudinary.enabled:false}")
    private boolean enabled;

    @Bean
    public Cloudinary cloudinary() {
        if (!enabled) {
            logger.warn("=================================================================");
            logger.warn("  Cloudinary is DISABLED. File uploads will not work.");
            logger.warn("  To enable: set CLOUDINARY_ENABLED=true and provide credentials:");
            logger.warn("    CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
            logger.warn("  Get credentials at: https://cloudinary.com -> Dashboard");
            logger.warn("=================================================================");
        } else {
            logger.info("Cloudinary configured for cloud: {}", cloudName);
        }

        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true  // always use HTTPS URLs
        ));
    }

    public boolean isEnabled() {
        return enabled;
    }
}
