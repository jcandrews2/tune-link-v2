package com.vibesbased.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ClassPathResource;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletion;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.nio.charset.StandardCharsets;
import java.io.IOException;
import java.util.Map;
import java.util.HashMap;

@Service
public class OpenAIService {

    private static final Logger logger = LoggerFactory.getLogger(OpenAIService.class);
    private final OpenAIClient client;
    private final String promptTemplate;

    public OpenAIService(@Value("${OPENAI_API_KEY}") String apiKey) throws IOException {
        logger.info("Initializing OpenAI Service with API key: {}", apiKey != null ? "present" : "null");
        this.client = OpenAIOkHttpClient.builder()
            .apiKey(apiKey)
            .build();
        
        Resource resource = new ClassPathResource("openai_prompt.txt");
        this.promptTemplate = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }

    public Map<String, Object> getSearchQuery(String userRequest) {
        try {
            ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
                .addSystemMessage(promptTemplate)
                .addUserMessage(userRequest)
                .model(ChatModel.GPT_4_1)
                .build();
            ChatCompletion chatCompletion = client.chat().completions().create(params);
            String output = chatCompletion.choices().get(0).message().content().orElse("");
            
            // Log ChatGPT's response to the terminal
            logger.info("ChatGPT Response: {}", output);
            
            // Split the response into lines
            String[] lines = output.split("\n");
            Map<String, Object> result = new HashMap<>();
            
            // First line is always the q_string
            result.put("q_string", lines[0].trim());
            
            // Second line is the offset if it exists, default to 0 if not
            int offset = 0;
            if (lines.length > 1) {
                try {
                    offset = Integer.parseInt(lines[1].trim());
                } catch (NumberFormatException e) {
                    logger.warn("Could not parse offset from second line: {}", lines[1]);
                }
            }
            result.put("offset", offset);
            
            return result;
        } catch (Exception e) {
            logger.error("Error while getting search query from OpenAI API", e);
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("q_string", "");
            fallback.put("offset", 0);
            return fallback;
        }
    }
}