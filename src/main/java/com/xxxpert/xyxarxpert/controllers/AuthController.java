package com.xxxpert.xyxarxpert.controllers;


import com.xxxpert.xyxarxpert.UserAlreadyExistsException;
import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@AllArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("user", new User());
        return "login";
    }

    @PostMapping("/register")
    public String register(@ModelAttribute("user") User user, Model model){
        System.out.println(user.toString());
        try {
            userService.registerUser(user);
            model.addAttribute("success", true);
            return "redirect:/auth/login?success=true";
        } catch (UserAlreadyExistsException e) {
            e.printStackTrace();
            model.addAttribute("error", "Пользователь с таким email уже зарегистрирован");
            return "register";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Произошла ошибка при регистрации. Попробуйте позже.");
            return "register";
        }
    }


}
