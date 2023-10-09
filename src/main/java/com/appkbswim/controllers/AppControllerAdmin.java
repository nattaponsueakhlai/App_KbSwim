package com.appkbswim.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AppControllerAdmin {

    //FrontEnd

    @GetMapping("krubirdswim")
    public String swiminfoRoute() {
        return "webinfo/swiminfo";
    }

    //-------------------------------------------------------------------------------------------------------------------------

    //Admin
    @GetMapping("loginAdmin")
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
