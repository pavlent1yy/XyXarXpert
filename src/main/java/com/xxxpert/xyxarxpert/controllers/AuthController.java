package com.xxxpert.xyxarxpert.controllers;


import com.xxxpert.xyxarxpert.UserAlreadyExistsException;
import com.xxxpert.xyxarxpert.entities.RegisterRequest;
import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.services.EmailService;
import com.xxxpert.xyxarxpert.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@AllArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final EmailService emailService;


    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("user", new User());
        return "login";
    }

    @GetMapping("/verify")
    public String verifyPage(@RequestParam(required = false) String email,
                             Model model) {
        model.addAttribute("email", email);
        return "verify";
    }

    @PostMapping("/verify")
    public String verifyEmail(@RequestParam String email,
                              @RequestParam String code, Model model){

        boolean isVerify = emailService.verifyCode(email, code);

        if (isVerify) {
            model.addAttribute("message", "Почта верифицирована");
            return "redirect:/auth/login?emailverified=true";
        } else {
            model.addAttribute("error", "Код не верный или истек");
            return "verify";
        }
    }

    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "register";
    }

    @PostMapping("/register")
    public String register(@ModelAttribute("registerRequest") RegisterRequest request,
                           BindingResult bindingResult,
                           Model model) {

        if (bindingResult.hasErrors()) {
            return "register";
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            model.addAttribute("error", "Пароли не совпадают");
            return "register";
        }

        try {
            userService.registerUser(request);
            if (userService.emailVerificationEnabled)
                return "redirect:/auth/verify?email=" + request.getEmail();
            else
                return "redirect:/auth/login?success=true";
        } catch (UserAlreadyExistsException e) {
            model.addAttribute("error", "Пользователь уже существует");
            return "register";
        }
    }

}
