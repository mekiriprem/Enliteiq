package com.example.demo.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Repository.AdminRepository;
import com.example.demo.Repository.ExamRepository;
import com.example.demo.Repository.SalesManRepository;
import com.example.demo.Repository.SchoolRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.ExamSummaryDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.dto.UserExamResultDTO;
import com.example.demo.model.Admin;
import com.example.demo.model.Exam;
import com.example.demo.model.User;

@Service
public class UserService {
    
    
    
  
    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private SalesManRepository salesManRepository;

    @Autowired
    private AdminRepository adminRepository;
    
    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.bucket}")
    private String bucket;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(User user) {
        String email = user.getEmail();

        boolean emailExists =
                userRepository.existsByEmail(email) ||
                schoolRepository.existsBySchoolEmail(email) ||
                salesManRepository.existsByEmail(email) ||
                adminRepository.findByEmail(email)!=null;

        if (emailExists) {
            throw new IllegalArgumentException("Email already registered in the system");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user = userRepository.save(user);
        user.setUserId("user" + user.getId());

        return userRepository.save(user); // Save updated userId
    }
//
//    public User loginUser(String email, String password) {
//        User user = userRepository.findByEmail(email);
//                
//        
//
//        if (!passwordEncoder.matches(password, user.getPassword())) {
//            throw new IllegalArgumentException("Invalid password");
//        }
//        return user;
//    }

    @Transactional
    public void registerUserToExam(Long userId, UUID examId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found"));

        List<Exam> exams = user.getRegisteredExams();

        if (!exams.contains(exam)) {
            exams.add(exam);
            user.setRegisteredExams(exams);
            userRepository.save(user);
        }
    }
    

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public UserDTO getUserByUserId(Long Id) {
        User user = userRepository.findById(Id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return convertToDto(user);
    }

    private UserDTO convertToDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setSchool(user.getSchool());
        dto.setUserClass(user.getUserClass());

        List<ExamSummaryDTO> exams = user.getRegisteredExams().stream()
                .map(this::convertExamToDto)
                .collect(Collectors.toList());

        dto.setRegisteredExams(exams);

        return dto;
    }

    private ExamSummaryDTO convertExamToDto(Exam exam) {
        ExamSummaryDTO dto = new ExamSummaryDTO();
        dto.setTitle(exam.getTitle());
        dto.setSubject(exam.getSubject());
        dto.setDate(exam.getDate());
        return dto;
    }
    


    public List<UserExamResultDTO> getUserExamResults(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getUserExams().stream().map(ue -> {
            Exam exam = ue.getExam();
            UserExamResultDTO dto = new UserExamResultDTO();

            dto.setExamTitle(exam.getTitle());
            dto.setSubject(exam.getSubject());
            dto.setDate(exam.getDate());
            dto.setTime(exam.getTime());
            dto.setPercentage(ue.getPercentage());

            // Construct Supabase public file path
            String safeUserName = user.getName().trim().replaceAll("[^a-zA-Z0-9_-]", "_");
            String safeSubject = exam.getSubject().trim().replaceAll("[^a-zA-Z0-9_-]", "_");

            String filePath = "certificates/" + safeUserName + "/" + safeSubject + ".pdf";
            String certificateUrl = supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + filePath;

            // OPTIONAL: verify if the certificate actually exists
            dto.setCertificateUrl(certificateUrl); // set as null if you validate and not found

            return dto;
        }).collect(Collectors.toList());
    }
    
    
    @Transactional
    public String registerAdmin(Admin user) {
        String email = user.getEmail();

        // Check if email already exists in any repository
        boolean emailExists = 
                userRepository.existsByEmail(email) || 
                schoolRepository.existsBySchoolEmail(email) || 
                salesManRepository.existsByEmail(email) || 
                adminRepository.findByEmail(email) != null;

        if (emailExists) {
            throw new IllegalArgumentException("Email already registered in the system");
        }

        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Save the user and get the generated ID
        Admin savedUser = adminRepository.save(user);
        
        
        return "admin saved sucessfully";
    }
    
    
    

}