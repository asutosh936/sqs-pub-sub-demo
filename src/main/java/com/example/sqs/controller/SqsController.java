package com.example.sqs.controller;

import com.example.sqs.service.SqsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sqs")
public class SqsController {

    private final SqsService sqsService;

    public SqsController(SqsService sqsService) {
        this.sqsService = sqsService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> send(@RequestBody String body) {
        sqsService.sendMessage(body);
        return ResponseEntity.ok("Message sent");
    }
}
