package com.xxxpert.xyxarxpert.controllers;

import com.xxxpert.xyxarxpert.entities.RepairRequest;
import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.repositories.RepairRequestRepository;
import com.xxxpert.xyxarxpert.services.RepairRequestService;
import com.xxxpert.xyxarxpert.services.SecurityUtil;
import lombok.AllArgsConstructor;
import org.springframework.boot.Banner;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@AllArgsConstructor
public class UserController {

    private final SecurityUtil util;
    private final RepairRequestService requestService;
    private final RepairRequestRepository repairRequestRepository;

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public String profile(Model model) {

        User user = util.getCurrentUser();

        List<RepairRequest> requests = requestService.getMyRequests();

        model.addAttribute("user", user);
        model.addAttribute("repairRequests", requests);

        return "profile";
    }

    @GetMapping("/profile/all-requests")
    @PreAuthorize("hasAnyAuthority('ROLE_OWNER','ROLE_MASTER')")
    public String allRequests(Model model){
        List<RepairRequest> repairRequests = requestService.getAllCreatedRequests();
        model.addAttribute("request", new RepairRequest());
        model.addAttribute("repairRequests", repairRequests);
        model.addAttribute("urgentCount", requestService.countUrgent(repairRequests));
        return "all-requests";
    }

}
