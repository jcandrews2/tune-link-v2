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
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class OpenAIService {

    private static final Logger logger = LoggerFactory.getLogger(OpenAIService.class);
    private final OpenAIClient client;
    private final String promptTemplate;
    private final ObjectMapper objectMapper;

    public OpenAIService(@Value("${OPENAI_API_KEY}") String apiKey) throws IOException {
        logger.info("Initializing OpenAI Service with API key: {}", apiKey != null ? "present" : "null");
        this.client = OpenAIOkHttpClient.builder()
            .apiKey(apiKey)
            .build();
        
        Resource resource = new ClassPathResource("openai_prompt.txt");
        this.promptTemplate = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        this.objectMapper = new ObjectMapper();
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
            
            logger.info("ChatGPT Response: {}", output);
            
            // Parse the JSON response directly
            return objectMapper.readValue(output, Map.class);
            
        } catch (Exception e) {
            logger.error("Error while getting search query from OpenAI API", e);
            // Fallback to a simple track search
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("endpoint", "spotify");
            fallback.put("query", userRequest);
            fallback.put("type", "track");
            return fallback;
        }
    }
}