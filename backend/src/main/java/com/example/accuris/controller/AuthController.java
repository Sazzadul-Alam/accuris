package com.example.accuris.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.accuris.service.OtpService;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send-otp")
    public String sendOtp(@RequestBody EmailRequest request) {
        otpService.sendOtp(request.getEmail());
        return "OTP sent";
    }

    @PostMapping("/verify-otp")
    public boolean verifyOtp(@RequestBody VerifyRequest request) {
        return otpService.verifyOtp(request.getEmail(), request.getOtp());
    }

    static class EmailRequest {
        private String email;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    static class VerifyRequest {
        private String email;
        private String otp;

        public String getEmail() {
            return email;
        }

        public String getOtp() {
            return otp;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }
}
