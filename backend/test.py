import base64
import binascii
from PIL import Image
from io import BytesIO
# let us load up and save a base64 encoded image as an image file

def decode_base64(data):
    # Add missing padding if necessary
    missing_padding = len(data) % 4
    if missing_padding:
        data += '=' * (4 - missing_padding)
    
    try:
        decoded_data = base64.b64decode(data)
        return decoded_data
    except binascii.Error as e:
        print(f"Error decoding Base64 data: {e}")
        return None
    
base64_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAnCAYAAACFSPFPAAAAAXNSR0IArs4c6QAAAm5JREFUWEftl7/rcVEcxz8YUBLJYqCwWGRh8gfY5C9g9WMgpYxSjAxk5T9gtCkbkywGSsomP5Ii4emor+59zj3OOdd1v8/w3JHPOed13p+fRwMAD/hHPs1/GIInZCnTbrchGo2CxWKR3PZyuYDBYOB2PhEmm81CuVwGk8nEvSlasNlswG63c63FYBqNBqRSKdBo0F+ffZPJBAKBAPMmIhgEkk6nmRezGOZyOajX6yymIIJ5PJTP8sViAV6vlw+GR5X9fg+9Xg8SiYTokPl8Dh6PBzuYVZ2XMiSY6/UKhUKBSWoU9LVaDYPpdrsQi8Wo6ojctFwuwel0PoP3fr9Dq9WCTCZD3URosN1uwWq1itaMx2MIhULUfWTVmXe7jkYjCAaDIpN+vw+RSER9GFRfbDbb78OQYqbT6WDBLiWTIm5CENVqldgCWAvoxzBSMSK8taw6Q42uvwxoavyYs6qC7GUrQ6vW5/MZisUiU316gZOGKySv2+3mFYxqfzgciKMHURnazamnvjEgjReSMN9SRch3Op2wWenXYBDY8XgEs9n8YiS6CfUmnkyQ67Zms/nqf7KziefwwWAA4XAYdDodtmw6nYLf73/+rgrMD8HtdgOtVisCWq1W4HK51IfZ7XZYWs9mM/D5fOrCoOdNPB7H3CScdVRzE6luCTu6KjDr9RocDodkzAsz9mswqJFWKhUwGo2SEKh05PN5Ue9SDIb3BSpVwz6CQS+KZDKJpSutBpFmYiLMcDh8Fiqlv3fDuWpdm+XpIwmjlCro5VkqlZgHLEVhWG7/zu1EN6GxUa/XU0OG9/ayYKgUXzD4KLWV5vkDW7IUEMSvF5wAAAAASUVORK5CYII="




image_file = decode_base64(base64_image.split(",")[1])

print(image_file, type(image_file))


# show the image
_image = Image.open(BytesIO(image_file))


_image.show()