package com.xxxpert.xyxarxpert.repositories;

import com.xxxpert.xyxarxpert.entities.RepairRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepairRequestRepository extends JpaRepository<RepairRequest, Long> {
}
