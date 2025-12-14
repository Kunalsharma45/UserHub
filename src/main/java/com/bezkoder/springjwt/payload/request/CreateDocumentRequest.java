package com.bezkoder.springjwt.payload.request;

import jakarta.validation.constraints.NotBlank;

public class CreateDocumentRequest {
    @NotBlank
    private String title;

    private String content;

    @NotBlank
    private String documentType; // NOTE, FILE, IMAGE

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }
}
