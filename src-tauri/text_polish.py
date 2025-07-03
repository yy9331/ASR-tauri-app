import sys
import re
import json
from typing import Dict, List, Optional

class TextPolish:
    def __init__(self):
        self.grammar_rules = {
            # 中文语法规则
            'zh': {
                'punctuation': {
                    '，': ',',
                    '。': '.',
                    '！': '!',
                    '？': '?',
                    '；': ';',
                    '：': ':',
                    '"': '"',
                    '"': '"',
                    ''': "'",
                    ''': "'",
                    '（': '(',
                    '）': ')',
                    '【': '[',
                    '】': ']',
                    '《': '<',
                    '》': '>'
                },
                'common_errors': {
                    '的的': '的',
                    '了了': '了',
                    '是是': '是',
                    '在在': '在',
                    '有有': '有',
                    '和和': '和',
                    '与与': '与',
                    '或或': '或',
                    '但但': '但',
                    '而而': '而'
                },
                'spacing_rules': [
                    (r'([a-zA-Z])([\u4e00-\u9fff])', r'\1 \2'),
                    (r'([\u4e00-\u9fff])([a-zA-Z])', r'\1 \2'),
                    (r'([0-9])([\u4e00-\u9fff])', r'\1 \2'),
                    (r'([\u4e00-\u9fff])([0-9])', r'\1 \2')
                ],
                # 中文智能标点符号插入规则
                'smart_punctuation': {
                    # 句末标点符号
                    '句末词': ['了', '的', '吧', '啊', '呢', '么', '哦', '呀', '嘛', '啦'],
                    '疑问词': ['什么', '怎么', '为什么', '哪里', '哪个', '谁', '几', '多少', '如何'],
                    '感叹词': ['真', '太', '好', '棒', '厉害', '精彩', '完美', '糟糕', '可怕'],
                    # 停顿词（需要逗号）
                    '停顿词': ['但是', '然而', '不过', '可是', '只是', '而且', '并且', '或者', '还是', '如果', '虽然', '因为', '所以', '因此', '然后', '接着', '最后', '首先', '其次', '另外', '此外', '同时', '总之', '总的来说', '总的来说', '总的来说']
                }
            },
            # 英文语法规则
            'en': {
                'common_errors': {
                    'the the': 'the',
                    'a a': 'a',
                    'an an': 'an',
                    'is is': 'is',
                    'are are': 'are',
                    'was was': 'was',
                    'were were': 'were',
                    'have have': 'have',
                    'has has': 'has',
                    'had had': 'had',
                    'will will': 'will',
                    'would would': 'would',
                    'can can': 'can',
                    'could could': 'could',
                    'should should': 'should',
                    'may may': 'may',
                    'might might': 'might'
                },
                'capitalization_rules': [
                    (r'\b(i)\b', 'I'),
                    (r'^([a-z])', lambda m: m.group(1).upper()),
                    (r'\. ([a-z])', lambda m: '. ' + m.group(1).upper())
                ]
            }
        }
    
    def detect_language(self, text: str) -> str:
        """检测文本语言"""
        chinese_chars = len(re.findall(r'[\u4e00-\u9fff]', text))
        english_chars = len(re.findall(r'[a-zA-Z]', text))
        
        if chinese_chars > english_chars:
            return 'zh'
        else:
            return 'en'
    
    def add_chinese_punctuation(self, text: str) -> str:
        """智能添加中文标点符号"""
        if not text.strip():
            return text
        
        # 如果文本已经有标点符号，先移除
        text = re.sub(r'[，。！？；：]', '', text)
        
        # 智能添加标点符号
        result = text
        
        # 1. 在停顿词前添加逗号
        for pause_word in self.grammar_rules['zh']['smart_punctuation']['停顿词']:
            pattern = f'({pause_word})'
            result = re.sub(pattern, r'，\1', result)
        
        # 2. 在疑问词后添加问号
        for question_word in self.grammar_rules['zh']['smart_punctuation']['疑问词']:
            pattern = f'({question_word}[^，。！？]*?)(?=\s|$)'
            result = re.sub(pattern, r'\1？', result)
        
        # 3. 在感叹词后添加感叹号
        for exclamation_word in self.grammar_rules['zh']['smart_punctuation']['感叹词']:
            pattern = f'({exclamation_word}[^，。！？]*?)(?=\s|$)'
            result = re.sub(pattern, r'\1！', result)
        
        # 4. 在句末词后添加句号
        for end_word in self.grammar_rules['zh']['smart_punctuation']['句末词']:
            pattern = f'({end_word})(?=\s|$)'
            result = re.sub(pattern, r'\1。', result)
        
        # 5. 确保句子以标点符号结尾
        if result and not result[-1] in '，。！？':
            result += '。'
        
        # 6. 清理多余的标点符号
        result = re.sub(r'[，。！？]+', lambda m: m.group(0)[-1], result)
        
        return result
    
    def polish_text(self, text: str, language: Optional[str] = None) -> Dict[str, str]:
        """修饰文本"""
        if not text.strip():
            return {
                'original': text,
                'polished': text,
                'language': 'unknown',
                'changes': []
            }
        
        # 检测语言
        if not language:
            language = self.detect_language(text)
        
        original_text = text
        polished_text = text
        changes = []
        
        if language in self.grammar_rules:
            rules = self.grammar_rules[language]
            
            # 中文特殊处理：智能添加标点符号
            if language == 'zh':
                # 检查是否缺少标点符号
                if not re.search(r'[，。！？；：]', polished_text):
                    polished_text = self.add_chinese_punctuation(polished_text)
                    changes.append("智能添加中文标点符号")
            
            # 应用标点符号规则
            if 'punctuation' in rules:
                for old, new in rules['punctuation'].items():
                    if old in polished_text:
                        polished_text = polished_text.replace(old, new)
                        changes.append(f"标点符号: '{old}' → '{new}'")
            
            # 应用常见错误修正
            if 'common_errors' in rules:
                for error, correction in rules['common_errors'].items():
                    if error in polished_text:
                        polished_text = polished_text.replace(error, correction)
                        changes.append(f"重复词修正: '{error}' → '{correction}'")
            
            # 应用空格规则
            if 'spacing_rules' in rules:
                for pattern, replacement in rules['spacing_rules']:
                    if isinstance(replacement, str):
                        new_text = re.sub(pattern, replacement, polished_text)
                        if new_text != polished_text:
                            polished_text = new_text
                            changes.append("添加中英文间空格")
                    else:
                        new_text = re.sub(pattern, replacement, polished_text)
                        if new_text != polished_text:
                            polished_text = new_text
                            changes.append("修正大小写")
            
            # 应用大小写规则
            if 'capitalization_rules' in rules:
                for pattern, replacement in rules['capitalization_rules']:
                    if isinstance(replacement, str):
                        new_text = re.sub(pattern, replacement, polished_text)
                        if new_text != polished_text:
                            polished_text = new_text
                            changes.append("修正大小写")
                    else:
                        new_text = re.sub(pattern, replacement, polished_text)
                        if new_text != polished_text:
                            polished_text = new_text
                            changes.append("修正大小写")
        
        # 通用清理
        # 移除多余空格
        polished_text = re.sub(r'\s+', ' ', polished_text)
        polished_text = polished_text.strip()
        
        # 确保句子以标点符号结尾
        if polished_text and not polished_text[-1] in '.!?。！？':
            if language == 'zh':
                polished_text += '。'
            else:
                polished_text += '.'
            changes.append("添加句末标点")
        
        return {
            'original': original_text,
            'polished': polished_text,
            'language': language,
            'changes': changes
        }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            'error': 'Usage: python text_polish.py <text> [language]'
        }))
        sys.exit(1)
    
    text = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else None
    
    polisher = TextPolish()
    result = polisher.polish_text(text, language)
    
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main() 