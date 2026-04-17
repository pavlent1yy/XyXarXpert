package com.xxxpert.xyxarxpert.services;

import com.xxxpert.xyxarxpert.entities.CreateRepairRequestDto;
import com.xxxpert.xyxarxpert.entities.RepairRequest;
import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.repositories.RepairRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RepairRequestService {

    private final RepairRequestRepository repairRequestRepository;
    private final SecurityUtil util;

    public void addRepairRequest(CreateRepairRequestDto dto) {
        RepairRequest request = new RepairRequest();
        User currentUser = util.getCurrentUser();
        log.debug("Start creating repair request: userId={}", currentUser.getId());

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
        try {
            repairRequestRepository.save(request);
            log.info(
                    "Repair request created: requestId={}, userId={}, priority={}, issueType={}",
                    request.getId(),
                    currentUser.getId(),
                    request.getPriority(),
                    request.getIssueType()
            );
        } catch (Exception ex) {
            log.error(
                    "Failed to create repair request: userId={}, title={}",
                    currentUser.getId(),
                    request.getTitle(),
                    ex
            );
            throw ex;
        }
    }

    private void validate(RepairRequest request) {

        if (request.getTitle() == null || request.getTitle().isBlank()) {
            log.warn("Validation failed: title is empty, userId={}", request.getUser().getId());
            throw new IllegalArgumentException("Title is required");
        }

        if (request.getPhoneModel() == null || request.getPhoneModel().isBlank()) {
            log.warn("Validation failed: phone model is empty, userId={}", request.getUser().getId());
            throw new IllegalArgumentException("Phone model is required");
        }

        if (request.getContactType() == null || request.getContactValue() == null) {
            log.warn("Validation failed: contact is empty, userId={}", request.getUser().getId());
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

    public List<RepairRequest> getMyRequests(){
        User user = util.getCurrentUser();
        return repairRequestRepository.findAllByUser(user);
    }

}
