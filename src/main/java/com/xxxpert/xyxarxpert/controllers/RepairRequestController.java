package com.xxxpert.xyxarxpert.controllers;

import com.xxxpert.xyxarxpert.entities.CreateRepairRequestDto;
import com.xxxpert.xyxarxpert.services.EmailService;
import com.xxxpert.xyxarxpert.services.RepairRequestService;
import com.xxxpert.xyxarxpert.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@AllArgsConstructor
public class RepairRequestController {

    private final UserService userService;
    private final EmailService emailService;
    private final RepairRequestService requestService;

    @PostMapping("/repair-request")
    public String newRepairRequest(@ModelAttribute CreateRepairRequestDto dto, Model model){
        requestService.addRepairRequest(dto);
        return "redirect:/profile";
    }

    @PostMapping("/api/repair-request/{id}/accept")
    @ResponseBody
    public ResponseEntity<?> accept(@PathVariable Long id, Authentication auth) {
        requestService.acceptRequest(id, auth.getName());
        return ResponseEntity.ok().build();
    }


}
