package com.cinema.spring.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter(autoApply = true)
public class PoltronasConverter implements AttributeConverter<List<List<Integer>>, String> {
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<List<Integer>> poltronas) {
        if (poltronas == null) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(poltronas);
        } catch (Exception e) {
            return "[]";
        }
    }

    @Override
    public List<List<Integer>> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(dbData, new TypeReference<List<List<Integer>>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}

