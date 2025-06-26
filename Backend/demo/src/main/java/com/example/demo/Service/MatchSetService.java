package com.example.demo.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Repository.MatchSetRepository;
import com.example.demo.dto.MatchSetDto;
import com.example.demo.dto.QuestionDto;
import com.example.demo.model.MatchSet;
import com.example.demo.model.Question;

@Service
public class MatchSetService {

    @Autowired
    private MatchSetRepository matchSetRepo;

    public MatchSet createMatchSet(MatchSetDto dto) {
        MatchSet matchSet = new MatchSet();
        matchSet.setTitle(dto.getTitle());
        matchSet.setSubject(dto.getSubject());
        matchSet.setDate(dto.getDate());
        matchSet.setDurationMinutes(dto.getDurationMinutes());

//        List<Question> questions = dto.getQuestions().stream().map(qdto -> {
//            Question q = new Question();
//            q.setQuestionText(qdto.getQuestionText());
//            q.setOptions(qdto.getOptions());
//            q.setCorrectAnswer(qdto.getCorrectAnswer());
//            q.setMatchSet(matchSet);
//            return q;
//        }).collect(Collectors.toList());
//
//        matchSet.setQuestions(questions);
        return matchSetRepo.save(matchSet);
    }
    
    public void bulkAddQuestions(Long matchSetId, List<QuestionDto> dtos) {
        MatchSet matchSet = matchSetRepo.findById(matchSetId)
            .orElseThrow(() -> new RuntimeException("MatchSet not found"));

        List<Question> newQuestions = dtos.stream().map(dto -> {
            Question q = new Question();
            q.setQuestionText(dto.getQuestionText());
            q.setOptions(dto.getOptions());
            q.setCorrectAnswer(dto.getCorrectAnswer());
            q.setMatchSet(matchSet);
            return q;
        }).toList();

        matchSet.getQuestions().addAll(newQuestions);
        matchSetRepo.save(matchSet);
    }
    
    public void bulkDeleteQuestions(Long matchSetId, List<Long> questionIds) {
        MatchSet matchSet = matchSetRepo.findById(matchSetId)
            .orElseThrow(() -> new RuntimeException("MatchSet not found"));

        matchSet.getQuestions().removeIf(q -> questionIds.contains(q.getId()));
        matchSetRepo.save(matchSet);
    }


}

