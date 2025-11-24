package com.example.accuris.store;

import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OtpStore {

    // Validity duration (e.g., 5 minutes)
    private static final long OTP_VALID_DURATION = 5 * 60 * 1000;

    // Using ConcurrentHashMap for thread safety
    private final Map<String, OtpRecord> store = new ConcurrentHashMap<>();

    public void saveOtp(String email, String otp) {
        long expiresAt = System.currentTimeMillis() + OTP_VALID_DURATION;
        store.put(email, new OtpRecord(otp, expiresAt));
    }

    public OtpRecord getOtp(String email) {
        return store.get(email);
    }

    public void removeOtp(String email) {
        store.remove(email);
    }

    // This inner class matches the usage in your Service
    public static class OtpRecord {
        public String otp;
        public long expiresAt;

        public OtpRecord(String otp, long expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
        }
    }
}