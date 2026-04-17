package com.xxxpert.xyxarxpert.services;

import com.xxxpert.xyxarxpert.entities.CreateRepairRequestDto;
import com.xxxpert.xyxarxpert.entities.RepairRequest;
import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.repositories.RepairRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairRequestService {

    private final RepairRequestRepository repairRequestRepository;
    private final SecurityUtil util;

    public void addRepairRequest(CreateRepairRequestDto dto) {
        RepairRequest request = new RepairRequest();
        User currentUser = util.getCurrentUser();
        request.setUser(currentUser);

        request.setId(null);
        request.setStatus("CREATED");
        request.setCreatedAt(OffsetDateTime.now());
        request.setUpdatedAt(null);

        request.setTitle(safeTrim(dto.getTitle()));
        request.setDescription(safeTrim(dto.getDescription()));
        request.setPhoneModel(safeTrim(dto.getPhoneModel()));
        request.setPriority(safeTrim(dto.getPriority()));
        request.setIssueType(safeTrim(dto.getIssueType()));

        request.setContactValue(safeTrim(dto.getContactValue()));
        request.setContactType(safeTrim(dto.getContactType()));
        validate(request);
        System.out.println(request);

        repairRequestRepository.save(request);
    }

    private void validate(RepairRequest request) {

        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }

        if (request.getPhoneModel() == null || request.getPhoneModel().isBlank()) {
            throw new IllegalArgumentException("Phone model is required");
        }

        if (request.getContactType() == null || request.getContactValue() == null) {
            throw new IllegalArgumentException("Contact is required");
        }

        List<String> allowed = List.of("PHONE", "EMAIL", "TELEGRAM", "WHATSAPP", "INSTAGRAM");

        if (!allowed.contains(request.getContactType())) {
            throw new IllegalArgumentException("Invalid contact type");
        }
    }

    private String safeTrim(String value) {
        return value == null ? null : value.trim();
    }

}
