package com.skillforge.service;

import com.skillforge.model.Course;
import com.skillforge.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }

    public List<Course> getCoursesByInstructor(String instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }

    public List<Course> getCoursesForStudent(String studentId) {
        return courseRepository.findByEnrolledStudentIdsContaining(studentId);
    }

    public Course createCourse(Course course) {
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public Course updateCourse(String id, Course courseDetails) {
        return courseRepository.findById(id).map(course -> {
            course.setTitle(courseDetails.getTitle());
            course.setDescription(courseDetails.getDescription());
            course.setCategory(courseDetails.getCategory());
            course.setThumbnail(courseDetails.getThumbnail());
            course.setPrice(courseDetails.getPrice());
            course.setIsFree(courseDetails.getIsFree());
            course.setModules(courseDetails.getModules());
            course.setUpdatedAt(LocalDateTime.now());
            return courseRepository.save(course);
        }).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }

    public Course enrollStudent(String courseId, String studentId) {
        return courseRepository.findById(courseId).map(course -> {
            if (!course.getEnrolledStudentIds().contains(studentId)) {
                course.getEnrolledStudentIds().add(studentId);
                return courseRepository.save(course);
            }
            return course;
        }).orElseThrow(() -> new RuntimeException("Course not found"));
    }
}
