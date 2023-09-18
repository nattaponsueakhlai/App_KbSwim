package com.appkbswim.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.UUID;

@Controller
public class AppController {

    //FrontEnd

    //-------------------------------------------------------------------------------------------------------------------------

    //Admin
    @GetMapping("")
    public String loginRoute() {
        return "admin/pages/login";
    }

    @GetMapping("index")
    public String indexRoute() {
        return "admin/pages/index";
    }

    @GetMapping("classroom")
    public String classroomRoute() {
        return "admin/pages/classroom";
    }
    //-------------------------------------------------------------------------------------------------------------------------


}
