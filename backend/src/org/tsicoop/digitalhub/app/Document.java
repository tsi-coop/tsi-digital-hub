package org.tsicoop.digitalhub.app;

import org.json.simple.JSONObject;
import org.tsicoop.digitalhub.framework.*;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.UUID;

public class Document implements REST {

    private static final String FUNCTION = "_func";

    private static final String UPLOAD = "upload_file";
    private static final String DOWNLOAD = "download_file";

    private static final String WINDOWS_BASE_PATH = "C:\\tmp\\upload";
    private static final String LINUX_BASE_PATH = "/data/upload";

    @Override
    public void get(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public void post(HttpServletRequest req, HttpServletResponse res) {
        JSONObject input = null;
        JSONObject output = null;
        String func = null;
        String basepath = null;

        try {
            input = InputProcessor.getInput(req);
            func = (String) input.get(FUNCTION);

            if(isWindows())
                basepath = WINDOWS_BASE_PATH;
            else
                basepath = LINUX_BASE_PATH;

            if(func != null){
                if(func.equalsIgnoreCase(UPLOAD)){
                    String file_extn = (String) input.get("file_extn");
                    String file_data = (String) input.get("file_data");
                    String docid = insertDocument(input);
                    saveDocFile(basepath,docid,file_extn, Base64.decode(file_data));
                    output = new JSONObject();
                    output.put("_docid",docid);
                    OutputProcessor.send(res, HttpServletResponse.SC_OK, output);
                }else if(func.equalsIgnoreCase(DOWNLOAD)){
                    String extn = (String) input.get("file_extn");
                    String id = (String) input.get("id");
                    // check if file exists
                    downloadFile(res, id, extn);
                }
            }

        }catch(Exception e){
            OutputProcessor.sendError(res,HttpServletResponse.SC_INTERNAL_SERVER_ERROR,"Unknown server error");
            e.printStackTrace();
        }
    }

    public void downloadFile(HttpServletResponse response, String id, String extn) throws Exception{
        String filePath = null;
        String fileName = null;
        String basepath = null;

        if(isWindows())
            basepath = WINDOWS_BASE_PATH;
        else
            basepath = LINUX_BASE_PATH;

        filePath = basepath + "/" + id + "." + extn;
        fileName = id + "." + extn;

        // Set the content type and headers
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=out.pdf");

        // Get the ServletOutputStream
        ServletOutputStream outputStream = response.getOutputStream();

        // Read the file and write it to the output stream
        try (FileInputStream fileInputStream = new FileInputStream(filePath)) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = fileInputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        }
        outputStream.flush();
        outputStream.close();
    }

    private boolean isWindows() {
        String os = System.getProperty("os.name");
        if(os.contains("Windows"))
            return true;
        else
            return false;
    }

    public String insertDocument(JSONObject input){
        String file_extn = (String) input.get("file_extn");
        String docUUID = UUID.randomUUID().toString();
        try{

            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "insert into _document (uuid,file_extn) values (?,?)";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, docUUID);
            pstmt.setString(2, file_extn);
            pstmt.executeUpdate();
        }catch(Exception e){
            e.printStackTrace();
        }
        return docUUID;
    }

    public boolean saveDocFile(String filepath, String docuuid, String fileextn, byte[] content) {
        boolean isSuccess = false;
        FileOutputStream fos = null;
        try {
            File file = new File(filepath, docuuid+"."+fileextn);
            fos = new FileOutputStream(file);
            fos.write(content);
            fos.close();
            isSuccess = true;
        } catch (Exception e) {
            isSuccess = false;
        } finally {
            if(fos != null) {
                try {
                    fos.close();
                } catch (Exception e) {
                }
            }
        }
        return isSuccess;
    }

    @Override
    public void delete(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public void put(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public boolean validate(String method, HttpServletRequest req, HttpServletResponse res) {
        return InputProcessor.validate( req,
                res);
    }
}
