package com.xxxpert.xyxarxpert.controllers;

import com.xxxpert.xyxarxpert.entities.CreateRepairRequestDto;
import com.xxxpert.xyxarxpert.services.EmailService;
import com.xxxpert.xyxarxpert.services.RepairRequestService;
import com.xxxpert.xyxarxpert.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@AllArgsConstructor
public class RepairRequestController {

    private final UserService userService;
    private final EmailService emailService;
    private final RepairRequestService requestService;

    @PostMapping("/repair-request")
    public String newRepairRequest(@ModelAttribute CreateRepairRequestDto dto, Model model){
        requestService.addRepairRequest(dto);
        return "redirect:/main"; // потом будем редиректить на текущие заявки в профиле пользователя
    }


}
