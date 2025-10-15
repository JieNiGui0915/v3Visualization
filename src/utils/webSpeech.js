
// Web Speech API 功能模块
// 支持语音识别和语音合成
// 用法示例见下方注释



class WebSpeech {
	constructor(options = {}) {
		// 语音识别
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
		if (this.recognition) {
			this.recognition.lang = options.lang || 'zh-CN';
			this.recognition.continuous = options.continuous || false;
			this.recognition.interimResults = options.interimResults || false;
		}
		// 语音合成
		this.synth = window.speechSynthesis || null;
		this.voice = null;
		this.onResult = options.onResult || function(text){};
		this.onError = options.onError || function(e){};
		this.onEnd = options.onEnd || function(){};
		this._pauseTimer = null;
		this._finalText = '';
			this._isRecognizing = false;
            this._setupEvents();
	}

	_setupEvents() {
		if (!this.recognition) return;
		this.recognition.onstart = () => {
			this._isRecognizing = true;
		};
		this.recognition.onend = () => {
			this._isRecognizing = false;
			this._clearPauseTimer();
			// 识别结束时返回最终文本
			if (this._finalText) {
				this.onResult(this._finalText);
			}
			this._finalText = '';
			this.onEnd();
		};
		this.recognition.onresult = (event) => {
            debugger
			let text = '';
			for (let i = event.resultIndex; i < event.results.length; ++i) {
				text += event.results[i][0].transcript;
			}
			this._finalText += text;
			this.onResult(text);
			// 识别到结果时重置停顿计时器
			this._resetPauseTimer();
		};
		this.recognition.onerror = (e) => {
			this.onError(e);
		};
	}

	// 开始语音识别
	startRecognition(lang) {
		if (!this.recognition) throw new Error('SpeechRecognition not supported');
		if (lang) this.recognition.lang = lang;
		this._finalText = '';
		// 如果已经在识别，先停止再启动
		if (this._isRecognizing) {
			this.stopRecognition();
			setTimeout(() => {
				if (!this._isRecognizing) {
					try {
						this.recognition.start();
						this._resetPauseTimer();
					} catch (e) {
						this.onError(e);
					}
				}
			}, 300);
		} else {
			try {
				this.recognition.start();
				this._resetPauseTimer();
			} catch (e) {
				this.onError(e);
			}
		}
	}

	// 判断识别是否正在进行
	_isRecognizing() {
		// 部分浏览器支持 recognition.running
		if (typeof this.recognition.running === 'boolean') {
			return this.recognition.running;
		}
		// 兼容性处理：通过标志位
		return this._pauseTimer != null;
	}

	// 停止语音识别
	stopRecognition() {
		if (!this.recognition) return;
		this.recognition.stop();
		this._clearPauseTimer();
	}

	// 停顿2秒自动停止识别
	_resetPauseTimer() {
		this._clearPauseTimer();
		this._pauseTimer = setTimeout(() => {
			this.stopRecognition();
		}, 2000);
	}
	_clearPauseTimer() {
		if (this._pauseTimer) {
			clearTimeout(this._pauseTimer);
			this._pauseTimer = null;
		}
	}

	// 朗读文本
	speak(text, lang = 'zh-CN') {
		if (!this.synth) throw new Error('SpeechSynthesis not supported');
		const utter = new SpeechSynthesisUtterance(text);
		utter.lang = lang;
		utter.onend = this.onEnd;
		utter.onerror = this.onError;
		this.synth.speak(utter);
	}

	// 停止朗读
	stopSpeak() {
		if (this.synth && this.synth.speaking) {
			this.synth.cancel();
		}
	}
}

export default WebSpeech;

/*
// 用法示例：
import WebSpeech from '@/utils/webSpeech.js';
const ws = new WebSpeech({
	lang: 'zh-CN',
	onResult: (text) => console.log('识别结果:', text),
	onError: (e) => console.error('语音错误:', e),
	onEnd: () => console.log('识别/朗读结束')
});
// 开始识别
ws.startRecognition();
// 停止识别
ws.stopRecognition();
// 朗读文本
ws.speak('你好，欢迎使用语音功能！');
// 停止朗读
ws.stopSpeak();
*/
