package com.tunelink.backend.service;

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

    public String getRecommendations(String userRequest) {
        try {
            ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
                .addSystemMessage(promptTemplate)
                .addUserMessage(userRequest)
                .model(ChatModel.GPT_4_1)
                .build();
            ChatCompletion chatCompletion = client.chat().completions().create(params);
            return chatCompletion.choices().get(0).message().content().orElse("{}");
        } catch (Exception e) {
            logger.error("Error while getting recommendations from OpenAI API", e);
            return "{}";
        }
    }
}