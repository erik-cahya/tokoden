const isDesktop = window.innerWidth > 768;
const initialLimit = isDesktop ? desktopLimit.initial : mobileLimit.initial;
const increment = isDesktop ? desktopLimit.increment : mobileLimit.increment;

$(".eniv-product-list").each(function () {
    const $productList = $(this);
    const $products = $productList.find(".eniv-product");
    const $loadMoreButton = $productList.find(".load-more");
    const totalProducts = $products.length;

    let currentLimit = initialLimit;

    if (totalProducts <= initialLimit) {
        $loadMoreButton.hide();
    }

    function setProductVisibility() {
        $products.hide();
        $products.slice(0, currentLimit).show();

        if (currentLimit >= totalProducts) {
            $loadMoreButton.hide();
        }
    }

    setProductVisibility();

    $loadMoreButton.on("click", function () {
        currentLimit += increment;
        setProductVisibility();
    });
});
