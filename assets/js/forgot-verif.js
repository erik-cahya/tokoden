let interval;
let isOtpSending = false;

function countdown(seconds) {
    clearInterval(interval);

    $("#div-send").addClass("d-none");
    $("#div-waiting").removeClass("d-none");
    $("#div-waiting-wait").removeClass("d-none");
    $("#div-waiting-ready").addClass("d-none");

    interval = setInterval(() => {
        if (seconds > 0) {
            $("#div-waiting-wait span").text(`${seconds} Detik`);
            seconds--;
        } else {
            clearInterval(interval);
            $("#div-waiting-wait").addClass("d-none");
            $("#div-waiting-ready").removeClass("d-none");
        }
    }, 1000);
}

function send_otp() {
    if (isOtpSending) {
        Swal.fire(
            "Terjadi Kesalahan",
            "Pengiriman OTP sedang berlangsung, harap tunggu!",
            "error"
        );
    } else {
        const type = $('select[name="type"]').val();

        if (type !== "Email" && type !== "Wa") {
            Swal.fire(
                "Terjadi Kesalahan",
                "Silakan pilih metode pengiriman yang valid (Email atau Whatsapp).",
                "error"
            );
        } else {
            isOtpSending = true;

            $.ajax({
                url: base_url + "/ajax/auth/send-otp",
                method: "POST",
                data: {
                    type: type,
                    mode: mode,
                },
                dataType: "JSON",
                success: function (response) {
                    if (response.status) {
                        Swal.fire("Berhasil", response.message, "success");

                        $("#div-send").addClass("d-none");
                        $("#div-waiting").removeClass("d-none");
                        $("#div-waiting-wait").removeClass("d-none");

                        countdown(response.second);
                    } else {
                        Swal.fire(
                            "Terjadi Kesalahan",
                            response.message,
                            "error"
                        );
                    }
                },
                error: function () {
                    Swal.fire(
                        "Terjadi Kesalahan",
                        "Terjadi kesalahan saat mengirim OTP.",
                        "error"
                    );
                },
                complete: function () {
                    isOtpSending = false;
                },
            });
        }
    }
}

$("#div-waiting-ready span").on("click", function () {
    $("#div-waiting-ready").addClass("d-none");
    $("#div-send").removeClass("d-none");
});

$(document).on("click", function () {
    if (
        $("#div-send").hasClass("d-none") &&
        $("#div-waiting").hasClass("d-none")
    ) {
        Swal.fire(
            "Terjadi Kesalahan",
            "Akses tidak valid, harap muat ulang halaman.",
            "error"
        );
        location.reload();
    }
});
