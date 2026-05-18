package com.skillforge.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    // Match everything without a suffix (so not files) or /api
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        // Forward to the React frontend
        return "forward:/";
    }
}
