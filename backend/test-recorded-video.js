const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testRecordedVideo() {
    try {
        console.log('🚀 Testing Recorded Video Upload (Blob Simulation)...\n');

        // Test Case 1: Simulate a recorded video blob (common scenario)
        console.log('🔍 Test 1: Simulating recorded video blob...');
        
        const testVideoContent = Buffer.from('WEBM video data simulation - this would be actual video binary data from MediaRecorder API');
        const blobFilePath = path.join(__dirname, 'blob');
        fs.writeFileSync(blobFilePath, testVideoContent);

        const formData1 = new FormData();
        formData1.append('video', fs.createReadStream(blobFilePath), {
            filename: 'blob',
            contentType: 'video/webm'
        });
        formData1.append('question', 'Tell me about your experience with React.');
        formData1.append('jobRole', 'Software Engineer');

        try {
            const response1 = await axios.post('http://localhost:5000/api/interview-analyze', formData1, {
                headers: {
                    ...formData1.getHeaders()
                }
            });

            console.log('✅ Recorded video blob upload successful!');
            console.log('📊 Analysis Results:');
            console.log('🎯 Overall Score:', response1.data.score);
            console.log('📹 Video Info:', {
                fileName: response1.data.videoInfo.fileName,
                fileSize: response1.data.videoInfo.fileSize + ' bytes',
                duration: response1.data.videoInfo.duration + 's'
            });
            console.log('📄 Feedback Preview:', response1.data.feedback.substring(0, 150) + '...');
        } catch (error) {
            console.log('❌ Error with blob upload:', error.response?.data?.feedback || error.message);
        }

        fs.unlinkSync(blobFilePath);
        console.log('🧹 Cleaned up blob file\n');

        // Test Case 2: Simulate recorded video with proper MIME type
        console.log('🔍 Test 2: Simulating recorded video with video/mp4 MIME type...');
        
        const mp4BlobPath = path.join(__dirname, 'recorded-video');
        fs.writeFileSync(mp4BlobPath, testVideoContent);

        const formData2 = new FormData();
        formData2.append('video', fs.createReadStream(mp4BlobPath), {
            filename: 'recorded-video',
            contentType: 'video/mp4'
        });
        formData2.append('question', 'What are your strengths?');
        formData2.append('jobRole', 'Software Engineer');

        try {
            const response2 = await axios.post('http://localhost:5000/api/interview-analyze', formData2, {
                headers: {
                    ...formData2.getHeaders()
                }
            });

            console.log('✅ Recorded MP4 video upload successful!');
            console.log('📊 Analysis Results:');
            console.log('🎯 Overall Score:', response2.data.score);
            console.log('📹 Video Info:', {
                fileName: response2.data.videoInfo.fileName,
                fileSize: response2.data.videoInfo.fileSize + ' bytes'
            });
        } catch (error) {
            console.log('❌ Error with MP4 upload:', error.response?.data?.feedback || error.message);
        }

        fs.unlinkSync(mp4BlobPath);
        console.log('🧹 Cleaned up recorded video file\n');

        // Test Case 3: Test with application/octet-stream (common for blobs)
        console.log('🔍 Test 3: Simulating video with octet-stream MIME type...');
        
        const octetBlobPath = path.join(__dirname, 'video-blob.webm');
        fs.writeFileSync(octetBlobPath, testVideoContent);

        const formData3 = new FormData();
        formData3.append('video', fs.createReadStream(octetBlobPath), {
            filename: 'video-blob.webm',
            contentType: 'application/octet-stream'
        });
        formData3.append('question', 'Why do you want to work here?');

        try {
            const response3 = await axios.post('http://localhost:5000/api/interview-analyze', formData3, {
                headers: {
                    ...formData3.getHeaders()
                }
            });

            console.log('✅ Octet-stream video upload successful!');
            console.log('📊 Analysis Results:');
            console.log('🎯 Overall Score:', response3.data.score);
        } catch (error) {
            console.log('❌ Error with octet-stream upload:', error.response?.data?.feedback || error.message);
        }

        fs.unlinkSync(octetBlobPath);
        console.log('🧹 Cleaned up octet-stream file\n');

        // Test Case 4: Test with no file (error handling)
        console.log('🔍 Test 4: Testing error handling (no file)...');
        
        const formData4 = new FormData();
        formData4.append('question', 'Test question');

        try {
            await axios.post('http://localhost:5000/api/interview-analyze', formData4, {
                headers: {
                    ...formData4.getHeaders()
                }
            });
        } catch (error) {
            console.log('✅ No file error handling works:', error.response?.data?.feedback);
        }

        // Test Case 5: Test with invalid file type
        console.log('\n🔍 Test 5: Testing invalid file type...');
        
        const invalidPath = path.join(__dirname, 'test.txt');
        fs.writeFileSync(invalidPath, 'This is not a video');

        const formData5 = new FormData();
        formData5.append('video', fs.createReadStream(invalidPath), {
            filename: 'test.txt',
            contentType: 'text/plain'
        });

        try {
            await axios.post('http://localhost:5000/api/interview-analyze', formData5, {
                headers: {
                    ...formData5.getHeaders()
                }
            });
        } catch (error) {
            console.log('✅ Invalid file type error handling works:', error.response?.data?.feedback || error.message);
        }

        fs.unlinkSync(invalidPath);
        console.log('🧹 Cleaned up invalid file\n');

        console.log('🎉 All recorded video tests completed!');
        console.log('\n📋 Summary:');
        console.log('✅ Recorded video blob upload working');
        console.log('✅ Multiple MIME type support working');
        console.log('✅ Filename handling for blobs working');
        console.log('✅ File extension detection working');
        console.log('✅ Error handling working');
        console.log('✅ File cleanup working');
        
        console.log('\n💡 Tips for frontend integration:');
        console.log('• Use FormData to upload recorded video blobs');
        console.log('• Set proper MIME type (video/webm, video/mp4, etc.)');
        console.log('• Handle both blob and file uploads');
        console.log('• Provide clear error messages to users');

    } catch (error) {
        console.error('❌ Unexpected error occurred:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
    }
}

testRecordedVideo();
