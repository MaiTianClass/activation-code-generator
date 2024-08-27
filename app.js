async function generateActivationCode() {
    const userKey = document.getElementById("activationKey").value;

    // 检查输入是否为空
    if (!userKey) {
        alert("请先输入密钥再生成激活码！");
        document.getElementById("generatedCode").innerText = ""; // 不显示任何文字
        return;
    }

    // 等待 Promise 解析并显示激活码
    const activationCode = await generateActivationCodeFromKey(userKey);
    document.getElementById("generatedCode").innerText = activationCode;
}

function generateActivationCodeFromKey(key) {
    // 使用 Web Crypto API 进行 SHA-256 哈希计算
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(key)).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        const rawCode = hashHex.slice(0, 24).toUpperCase();

        return formatActivationCode(rawCode);
    });
}

function formatActivationCode(code) {
    // 将24位激活码分为5段
    const part1 = code.slice(0, 4);
    const part2 = code.slice(4, 9);
    const part3 = code.slice(9, 14);
    const part4 = code.slice(14, 19);
    const part5 = code.slice(19, 24);

    return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

function copyToClipboard() {
    const activationCode = document.getElementById("generatedCode").innerText;
    const userKey = document.getElementById("activationKey").value;

    if (!userKey || !activationCode) {
        alert("请先输入密钥并生成激活码！");
        return;
    }

    // 复制激活码到剪贴板
    navigator.clipboard.writeText(activationCode).then(() => {
        alert("激活码已成功复制到剪贴板!");
    }, err => {
        alert("复制失败，请手动复制!");
    });
}
