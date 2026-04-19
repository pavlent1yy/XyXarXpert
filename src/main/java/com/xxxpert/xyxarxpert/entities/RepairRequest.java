package com.xxxpert.xyxarxpert.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "repair_request")
public class RepairRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Size(max = 255)
    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Column(name = "description", nullable = false, length = Integer.MAX_VALUE)
    private String description;

    @Size(max = 50)
    @NotNull
    @ColumnDefault("'CREATED'")
    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Size(max = 50)
    @ColumnDefault("'MEDIUM'")
    @Column(name = "priority", length = 50)
    private String priority;

    @ColumnDefault("now()")
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Size(max = 100)
    @NotNull
    @ColumnDefault("'UNKNOWN'")
    @Column(name = "phone_model", nullable = false, length = 100)
    private String phoneModel;

    @Size(max = 100)
    @NotNull
    @ColumnDefault("'UNKNOWN'")
    @Column(name = "issue_type", nullable = false, length = 100)
    private String issueType;

    @Size(max = 50)
    @NotNull
    @ColumnDefault("'PHONE'")
    @Column(name = "contact_type", nullable = false, length = 50)
    private String contactType;

    @Size(max = 150)
    @NotNull
    @ColumnDefault("'UNKNOWN'")
    @Column(name = "contact_value", nullable = false, length = 150)
    private String contactValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "master_id", referencedColumnName = "id")
    private User master;
    
    @Size(max = 512)
    @Column(name = "stream_link", length = 512)
    private String streamLink;


    @Override
    public String toString() {
        return "RepairRequest{" +
                "id=" + id +
                ", user=" + user +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", status='" + status + '\'' +
                ", priority='" + priority + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", phoneModel='" + phoneModel + '\'' +
                ", issueType='" + issueType + '\'' +
                ", contactType='" + contactType + '\'' +
                ", contactValue='" + contactValue + '\'' +
                '}';
    }
}