package com.example.demo.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Repository.MatchSetRepository;
import com.example.demo.Service.MatchSetService;
import com.example.demo.dto.AnswerDto;
import com.example.demo.dto.MatchSetDto;
import com.example.demo.dto.MatchSetSummaryDto;
import com.example.demo.dto.QuestionDto;
import com.example.demo.dto.ResultDto;
import com.example.demo.dto.StudentAnswerDto;
import com.example.demo.dto.TestWithQuestionsDto;
import com.example.demo.model.MatchSet;
import com.example.demo.model.Question;

@RestController
@RequestMapping("/api/matchsets")
public class MatchSetController {
    
    @Autowired
    private MatchSetRepository  matchSetRepository;

    @Autowired
    private MatchSetService matchSetService;
    
    @Autowired
    
    private MatchSetRepository matchSetRepo;

    @PostMapping
    public ResponseEntity<MatchSet> createMatchSet(@RequestBody MatchSetDto dto) {
        MatchSet matchSet = matchSetService.createMatchSet(dto);
        return ResponseEntity.ok(matchSet);
    }
    
    @PostMapping("/submit")
    public ResponseEntity<ResultDto> evaluate(@RequestBody StudentAnswerDto submission) {
        Optional<MatchSet> optionalMatchSet = matchSetRepo.findById(submission.getMatchSetId());

        if (optionalMatchSet.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        MatchSet matchSet = optionalMatchSet.get();
        Map<Long, String> correctAnswers = matchSet.getQuestions().stream()
            .collect(Collectors.toMap(Question::getId, Question::getCorrectAnswer));

        int total = submission.getAnswers().size();
        int correct = 0;

        for (AnswerDto ans : submission.getAnswers()) {
            if (correctAnswers.containsKey(ans.getQuestionId()) &&
                correctAnswers.get(ans.getQuestionId()).equalsIgnoreCase(ans.getSelectedAnswer())) {
                correct++;
            }
        }

        int incorrect = total - correct;
        double percentage = (correct * 100.0) / total;
        String resultStatus = percentage >= 50 ? "Pass" : "Fail";

        ResultDto result = new ResultDto();
        result.setTotalQuestions(total);
        result.setCorrectAnswers(correct);
        result.setIncorrectAnswers(incorrect);
        result.setPercentage(percentage);
        result.setResultStatus(resultStatus);

        return ResponseEntity.ok(result);
    }
    @PostMapping("/{matchSetId}/questions/bulk")
    public ResponseEntity<String> bulkAddQuestions(@PathVariable Long matchSetId,
                                                   @RequestBody List<QuestionDto> questions) {
        matchSetService.bulkAddQuestions(matchSetId, questions);
        return ResponseEntity.ok("Questions added successfully");
    }
    @DeleteMapping("/{matchSetId}/questions/bulk")
    public ResponseEntity<String> bulkDeleteQuestions(@PathVariable Long matchSetId,
                                                      @RequestBody List<Long> questionIds) {
        matchSetService.bulkDeleteQuestions(matchSetId, questionIds);
        return ResponseEntity.ok("Questions deleted successfully");
    }
    
    @GetMapping
    public ResponseEntity<List<MatchSetSummaryDto>> getAllMatchSets() {
        List<MatchSet> matchSets = matchSetRepository.findAll();
        List<MatchSetSummaryDto> summaries = matchSets.stream().map(ms -> {
            MatchSetSummaryDto dto = new MatchSetSummaryDto();
            dto.setId(ms.getId());
            dto.setTitle(ms.getTitle());
            dto.setSubject(ms.getSubject());
            dto.setDate(ms.getDate());
            dto.getDurationMinutes();
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(summaries);
    }
    
    @GetMapping("/{matchSetId}/questions")
    public ResponseEntity<List<QuestionDto>> getQuestionsByMatchSet(@PathVariable Long matchSetId) {
        MatchSet matchSet = matchSetRepository.findById(matchSetId)
            .orElseThrow(() -> new RuntimeException("MatchSet not found"));

        List<QuestionDto> questions = matchSet.getQuestions().stream().map(q -> {
            QuestionDto dto = new QuestionDto();
            dto.setId(q.getId());
            dto.setQuestionText(q.getQuestionText());
            dto.setOptions(q.getOptions());
            dto.getDurationMinutes();
            
            return dto;
        }).toList();

        return ResponseEntity.ok(questions);
    }
    
    @GetMapping("/{matchSetId}/details")
    public ResponseEntity<TestWithQuestionsDto> getTestDetails(@PathVariable Long matchSetId) {
        MatchSet matchSet = matchSetRepository.findById(matchSetId)
            .orElseThrow(() -> new RuntimeException("MatchSet not found"));

        TestWithQuestionsDto dto = new TestWithQuestionsDto();
        dto.setId(matchSet.getId());
        dto.setTitle(matchSet.getTitle());
        dto.setSubject(matchSet.getSubject());
        dto.setDate(matchSet.getDate());
        dto.setDurationMinutes(matchSet.getDurationMinutes());

        List<QuestionDto> questions = matchSet.getQuestions().stream().map(q -> {
            QuestionDto qDto = new QuestionDto();
            qDto.setId(q.getId());
            qDto.setQuestionText(q.getQuestionText());
            qDto.setOptions(q.getOptions());
            return qDto;
        }).toList();

        dto.setQuestions(questions);

        return ResponseEntity.ok(dto);
    }


}

