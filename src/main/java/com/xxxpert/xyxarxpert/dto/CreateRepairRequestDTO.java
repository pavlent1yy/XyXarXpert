package com.xxxpert.xyxarxpert.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRepairRequestDTO {

    private String title;
    private String description;

    private String phoneModel;
    private String issueType;

    private String contactType;
    private String contactValue;

    private String priority;
}
