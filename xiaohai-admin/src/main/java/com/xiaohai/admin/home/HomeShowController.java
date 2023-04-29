package com.xiaohai.admin.home;

import com.xiaohai.common.daomain.Response;
import com.xiaohai.note.pojo.dto.TagsDto;
import com.xiaohai.note.service.TagsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @description: 展示页接口
 * @author: xiaohai
 * @date: 2023-04-29 21:52
 **/
@Tag(name = "展示页接口", description = "展示页接口 ")
@RestController
@RequiredArgsConstructor
@RequestMapping("/home/show")
public class HomeShowController {
    private final TagsService tagsService;
    @Operation(summary = "标签")
    @GetMapping("/tags")
    public Response<List<TagsDto>> getRank() {
        return Response.success("获取标签成功！", tagsService.optionSelect());
    }
}
