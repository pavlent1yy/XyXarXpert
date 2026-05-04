package com.xxxpert.xyxarxpert.controllers;

import com.xxxpert.xyxarxpert.RepairRequestStatus;
import com.xxxpert.xyxarxpert.entities.CreateRepairRequestDto;
import com.xxxpert.xyxarxpert.entities.RepairRequest;
import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.services.EmailService;
import com.xxxpert.xyxarxpert.services.RepairRequestService;
import com.xxxpert.xyxarxpert.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@AllArgsConstructor
public class RepairRequestController {

    private final RepairRequestService requestService;
    private final EmailService emailService;
    private final UserService userService;

    @PostMapping("/repair-request")
    @PreAuthorize("hasRole('USER')")
    public String newRepairRequest(@ModelAttribute CreateRepairRequestDto dto, Model model){
        requestService.addRepairRequest(dto);
        return "redirect:/profile";
    }

    @PostMapping("/api/repair-request/{id}/accept")
    @ResponseBody
    public ResponseEntity<?> accept(@PathVariable Long id, Authentication auth) {
        requestService.updateRequestStatus(id, auth.getName(), RepairRequestStatus.TAKEN);
        RepairRequest request = requestService.getRequestById(id);
        emailService.sendRepairTakenNotification(userService.getUserByRepairRequest(id).getEmail(), request.getMaster());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/repair-request/{id}/cancel")
    @ResponseBody
    public ResponseEntity<?> cancel(@PathVariable Long id){
        requestService.cancelRequest(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/repair-request/{id}/start-repair")
    @ResponseBody
    public ResponseEntity<?> start(@PathVariable Long id, Authentication auth){
        requestService.updateRequestStatus(id, auth.getName(), RepairRequestStatus.IN_PROGRESS);
        RepairRequest request = requestService.getRequestById(id);
        emailService.sendRepairStartNotification(userService.getUserByRepairRequest(id).getEmail(),
                request.getStreamLink(), request.getMaster());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/repair-request/{id}/complete")
    @ResponseBody
    public ResponseEntity<?> complete(@PathVariable Long id, Authentication auth){
        requestService.updateRequestStatus(id, auth.getName(), RepairRequestStatus.DONE);
        return ResponseEntity.ok().build();
    }



}
