package com.xxxpert.xyxarxpert.repositories;

import com.xxxpert.xyxarxpert.RepairRequestStatus;
import com.xxxpert.xyxarxpert.entities.RepairRequest;
import com.xxxpert.xyxarxpert.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepairRequestRepository extends JpaRepository<RepairRequest, Long> {
    List<RepairRequest> findAllByUser(User user);
    List<RepairRequest> findAllByStatusOrderByCreatedAtAsc(RepairRequestStatus status);
    Optional<RepairRequest> findById(Long id);
    List<RepairRequest> findAllByMaster(User master);
}
