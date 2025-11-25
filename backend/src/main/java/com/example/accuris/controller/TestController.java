package com.example.accuris.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
@CrossOrigin("*")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "Backend is working!";
    }

    @PostMapping("/echo")
    public String echo(@RequestBody String body) {
        return "Received: " + body;
    }
}