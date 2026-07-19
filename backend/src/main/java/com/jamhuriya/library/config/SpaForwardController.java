package com.jamhuriya.library.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping({
            "/books", "/books/{id}",
            "/branches", "/branches/{branchId}",
            "/cart", "/contact", "/login", "/register",
            "/dashboard", "/admin", "/orders"
    })
    public String forwardApplicationRoutes() {
        return "forward:/index.html";
    }
}
