package com.example.demo.model;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
@Data
public class UserExamId implements Serializable {
    private Long userId;
    private UUID examId;

    public UserExamId() {}

    public UserExamId(Long userId, UUID examId) {
        this.userId = userId;
        this.examId = examId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserExamId)) return false;
        UserExamId that = (UserExamId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(examId, that.examId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, examId);
    }
}
