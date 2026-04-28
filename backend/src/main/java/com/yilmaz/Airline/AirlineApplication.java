package com.yilmaz.Airline;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.nio.charset.StandardCharsets;

@SpringBootApplication
public class AirlineApplication {

	@Autowired
	private JavaMailSender javaMailSender;

	public static void main(String[] args) {
		SpringApplication.run(AirlineApplication.class, args);
	}

	   /*@Bean
	   CommandLineRunner runner(){
       return args -> {
           try {

               MimeMessage mimeMessage = javaMailSender.createMimeMessage();
               MimeMessageHelper helper = new MimeMessageHelper(
                       mimeMessage,
                       MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                       StandardCharsets.UTF_8.name()
               );
               helper.setTo("burakyilmz57@gmail.com");
               helper.setSubject("Hello Testing");
               helper.setText("testing email 123, hello world");

               System.out.println("About to send Email...");
               javaMailSender.send(mimeMessage);

           }catch (Exception ex){
               System.out.println(ex.getMessage());
           }
       };
   }*/

}





