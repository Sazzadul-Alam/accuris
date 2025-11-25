package com.example.accuris.service;

import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.accuris.store.OtpStore;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private OtpStore otpStore;

    public void sendOtp(String email) {
        String otp = generateOtp();
        otpStore.saveOtp(email, otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP is: " + otp);

        // mailSender.send(message);
        System.out.println("MOCK EMAIL: " + email + " -> " + otp);

        // System.out.println("DEBUG OTP: " + otp);
    }

    public boolean verifyOtp(String email, String otp) {
        var record = otpStore.getOtp(email);
        if (record == null) return false;
        if (System.currentTimeMillis() > record.expiresAt) return false;
        if (!record.otp.equals(otp)) return false;

        otpStore.removeOtp(email);
        return true;
    }

    private String generateOtp() {
        // return String.format("%06d", new Random().nextInt(999999));
        return "123456";
    }
}
