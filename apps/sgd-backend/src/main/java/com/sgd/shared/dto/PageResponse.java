package com.sgd.shared.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.hibernate.orm.panache.PanacheQuery;

import java.util.List;

/**
 * Generic pagination response wrapper.
 * Used for all paginated endpoints in the API.
 */
public class PageResponse<T> {

    @JsonProperty("content")
    private List<T> content;

    @JsonProperty("pagination")
    private PaginationInfo pagination;

    // Constructors
    public PageResponse() {}

    public PageResponse(List<T> content, PaginationInfo pagination) {
        this.content = content;
        this.pagination = pagination;
    }

    // Factory method for Panache queries
    public static <T> PageResponse<T> of(PanacheQuery<T> query, int page, int size) {
        List<T> content = query.page(page, size).list();
        long totalElements = query.count();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        PaginationInfo paginationInfo = new PaginationInfo(
            page, size, totalElements, totalPages
        );

        return new PageResponse<>(content, paginationInfo);
    }

    // Factory method for custom lists
    public static <T> PageResponse<T> of(List<T> content, int page, int size, long totalElements) {
        int totalPages = (int) Math.ceil((double) totalElements / size);
        PaginationInfo paginationInfo = new PaginationInfo(
            page, size, totalElements, totalPages
        );
        return new PageResponse<>(content, paginationInfo);
    }

    // Getters and Setters
    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }

    public PaginationInfo getPagination() {
        return pagination;
    }

    public void setPagination(PaginationInfo pagination) {
        this.pagination = pagination;
    }

    /**
     * Pagination metadata information.
     */
    public static class PaginationInfo {
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
        private boolean first;
        private boolean last;
        private boolean hasNext;
        private boolean hasPrevious;

        public PaginationInfo() {}

        public PaginationInfo(int page, int size, long totalElements, int totalPages) {
            this.page = page;
            this.size = size;
            this.totalElements = totalElements;
            this.totalPages = totalPages;
            this.first = page == 0;
            this.last = page >= totalPages - 1;
            this.hasNext = page < totalPages - 1;
            this.hasPrevious = page > 0;
        }

        // Getters and Setters
        public int getPage() {
            return page;
        }

        public void setPage(int page) {
            this.page = page;
        }

        public int getSize() {
            return size;
        }

        public void setSize(int size) {
            this.size = size;
        }

        public long getTotalElements() {
            return totalElements;
        }

        public void setTotalElements(long totalElements) {
            this.totalElements = totalElements;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public void setTotalPages(int totalPages) {
            this.totalPages = totalPages;
        }

        public boolean isFirst() {
            return first;
        }

        public void setFirst(boolean first) {
            this.first = first;
        }

        public boolean isLast() {
            return last;
        }

        public void setLast(boolean last) {
            this.last = last;
        }

        public boolean isHasNext() {
            return hasNext;
        }

        public void setHasNext(boolean hasNext) {
            this.hasNext = hasNext;
        }

        public boolean isHasPrevious() {
            return hasPrevious;
        }

        public void setHasPrevious(boolean hasPrevious) {
            this.hasPrevious = hasPrevious;
        }
    }
}