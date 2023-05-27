package com.xiaohai.note.pojo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <p>
 * 评论表 DTO 数据传输对象
 * </p>
 *
 * @author xiaohai
 * @since 2023-05-24
 */
@Getter
@Setter
@Schema(name = "CommentDto", description = "评论表 DTO 数据传输对象")
public class CommentDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Schema(description = "id")
    private Integer id;

    @Schema(description = "父id")
    private Integer parentId;

    @Schema(description = "文章id")
    private Integer articleId;

    @Schema(description = "用户id")
    private Integer userId;

    @Schema(description = "评论内容")
    private String content;

    @Schema(description = "创建时间")
    private LocalDateTime createdTime;
    
    @Schema(description = "文章标题")
    private String title;

    @Schema(description = "用户名")
    private String username;

    @Schema(description = "头像地址")
    private String avatar;
}
