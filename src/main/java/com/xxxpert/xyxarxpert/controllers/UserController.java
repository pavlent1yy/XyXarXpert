package com.xxxpert.xyxarxpert.controllers;

import com.xxxpert.xyxarxpert.entities.RepairRequest;
import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.repositories.RepairRequestRepository;
import com.xxxpert.xyxarxpert.services.RepairRequestService;
import com.xxxpert.xyxarxpert.services.SecurityUtil;
import com.xxxpert.xyxarxpert.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@AllArgsConstructor
public class UserController {

    private final SecurityUtil util;
    private final RepairRequestService requestService;
    private final RepairRequestRepository repairRequestRepository;
    private final UserService userService;

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

    @GetMapping("/profile/my-requests")
    @PreAuthorize("hasAnyAuthority('ROLE_OWNER','ROLE_MASTER')")
    public String myRequests(Model model){
        User master = util.getCurrentUser();
        List<RepairRequest> myRequests = repairRequestRepository.findAllByMaster(master);
        model.addAttribute("myRequests", myRequests);
        return "my-requests";
    }

    @GetMapping("/profile/change-password")
    public String changePassword(){
        return "change-password";
    }

    @PostMapping("/profile/change-password")
    public String changePassword(@RequestParam String currentPassword,
                                 @RequestParam String newPassword,
                                 @RequestParam String confirmPassword,
                                 RedirectAttributes redirectAttributes) {

        if (!newPassword.equals(confirmPassword)) {
            redirectAttributes.addFlashAttribute("error", "Пароли не совпадают");
            return "redirect:/profile";
        }

        try {
            userService.changePassword(util.getCurrentUser(), currentPassword, newPassword);
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", "Текущий пароль неверный");
            return "redirect:/profile";
        }

        redirectAttributes.addFlashAttribute("success", "Пароль успешно изменён");
        return "redirect:/profile";
    }

    @GetMapping("/profile/edit-profile")
    public String editProfile(Model model){
        model.addAttribute("user", util.getCurrentUser());
        return "edit-profile";
    }

    @PostMapping("/profile/edit")
    public String editProfile(@RequestParam String firstName,
                              @RequestParam String middleName,
                              @RequestParam String lastName, RedirectAttributes redirectAttributes){
        boolean updated = userService.updateProfile(util.getCurrentUser().getId(), firstName.trim(), middleName.trim(), lastName.trim());

        if (!updated) {
            redirectAttributes.addFlashAttribute("info", "Данные не изменились");
        } else {
            redirectAttributes.addFlashAttribute("success", "Профиль обновлён");
        }        return "redirect:/profile";
    }

}
