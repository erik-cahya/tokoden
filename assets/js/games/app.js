var modalConfirm = new bootstrap.Modal(document.getElementById("modalConfirm"));

$("input[name=wa]").on("keyup", function () {
    var phone = $(this).val().replace(/\D/g, "");

    var final = phone.replace(/(\d{4})(\d{4})(\d+)/, "$1 $2 $3");

    $(this).val(final);
});

function product(id) {
    
    $(".eniv-product").removeClass("active");

    $("#product-" + id).addClass("active");

    $("input[name=product]").val(id);

    const section = $("#section-target");
    if (section.length) {
        $("html, body").animate({
            scrollTop: section.offset().top - 18,
        }, 100);
    }
    
    var quantity = 1;
    
    var quantity_data = $(".eniv-form-multi-target").val();
    
    if (quantity_data !== undefined) {
        
        var target_length = quantity_data.split("\n").filter(function (el) {
            return el !== '';
        }).length;
        
        if (target_length >= 1) {
            quantity = target_length;
        }
    }

    $.ajax({
        url: base_url + "/ajax/games/" + slug + "/price",
        type: "POST",
        data: {
            product: id,
            quantity: quantity,
        },
        dataType: "JSON",
        success: function (result) {
            $.each(result.method, function (index, item) {
                $("#method-" + item.method + " p").html(item.price);
            });

            $.each(result.category, function (index, item) {
                $(".method-category-" + item.method + " span").html(item.price);
            });
        },
    });
}

$(".eniv-form-multi-target").on('keyup', function() {
    
    var product_id = $("input[name=product]").val();
    
    if (product_id === "" || product_id === " " || product_id === 0 || product_id === "0") {
        
    } else {
        product(product_id);
    }
});

function method(id) {
    var product = $("input[name=product]").val();

    if (product === "" || product === " " || product === 0 || product === "0") {
        Swal.fire(
            "Terjadi Kesalahan",
            "Silahkan pilih produk terlebih dahulu",
            "error"
        );
    } else {
        $(".eniv-method").removeClass("active");

        $("#method-" + id).addClass("active");

        $("input[name=method]").val(id);
    }
}

function check_voucher() {
    var data = $("#form-order").serialize();

    $.ajax({
        url: base_url + "/ajax/games/" + slug + "/voucher",
        data: data,
        type: "POST",
        dataType: "JSON",
        beforeSend: function () {
            $("#btn-voucher").text("Loading...").attr("disabled", "disabled");
        },
        error: function () {
            $("#btn-voucher").html("Gunakan").removeAttr("disabled");
            Swal.fire(
                "Terjadi Kesalahan",
                "Silahkan reload halaman ini",
                "error"
            );
        },
        success: function (result) {
            $("#btn-voucher").html("Gunakan").removeAttr("disabled");

            if (result.status == true) {
                Swal.fire("Berhasil", result.message, "success");
            } else {
                Swal.fire("Terjadi Kesalahan", result.message, "error");
            }
        },
    });
}

function confirm() {
    var data = $("#form-order").serialize();

    $.ajax({
        url: base_url + "/ajax/games/" + slug + "/inquiry",
        data: data,
        type: "POST",
        dataType: "JSON",
        beforeSend: function () {
            $("#modalConfirm .modal-body").html(" ");
            $("#btn-confirm").text("Loading...").attr("disabled", "disabled");
        },
        error: function () {
            $("#btn-confirm")
                .html(
                    '<i class="fa fa-shopping-basket me-2"></i> Konfirmasi Pesanan'
                )
                .removeAttr("disabled");
            Swal.fire(
                "Terjadi Kesalahan",
                "Silahkan reload halaman ini",
                "error"
            );
        },
        success: function (result) {
            $("#btn-confirm")
                .html(
                    '<i class="fa fa-shopping-basket me-2"></i> Konfirmasi Pesanan'
                )
                .removeAttr("disabled");

            if (result.status == true) {
                $("#modalConfirm .modal-body").html(result.view);

                modalConfirm.show();
            } else {
                Swal.fire("Terjadi Kesalahan", result.message, "info");
            }
        },
    });
}

function orders() {
    $(".eniv-screenoff").addClass("show");
    $("#btn-orders").text("Loading...").attr("disabled", "disabled");

    setTimeout(function () {
        $("#form-order").submit();
    }, 1200);
}

$(".eniv-category span").on("click", function () {
    var id = $(this).attr("data-id");

    $(".eniv-category span").removeClass("active");

    $(this).addClass("active");

    $(".eniv-product-list").addClass("d-none");

    $("#category-" + id).removeClass("d-none");
});
