package com.xxxpert.xyxarxpert.entities;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRepairRequestDto {

    private String title;
    private String description;

    private String phoneModel;
    private String issueType;

    private String contactType;
    private String contactValue;

    private String priority;
}
