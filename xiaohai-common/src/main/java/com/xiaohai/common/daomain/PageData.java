package com.xiaohai.common.daomain;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * @author wangchenghai
 * @date 2023/01/17 14:54:43
 */
@Data
public class PageData {
    @Schema(description = "查询列表总记录数")
    private long total;
    @Schema(description = "每页显示条数，默认 10")
    private long size;
    @Schema(description = "当前页")
    private long current;
}
