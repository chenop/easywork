using System.Collections.Generic;
using System.Drawing;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices.ComTypes;
using System.Threading.Tasks;
using System.Web.Http;

namespace CvsMatcherApi.Controllers
{
    public class CvsMatcherController : ApiController
    {

        public async Task<Dictionary<string, bool>> MatchKeywords(Dictionary<string, bool> keywordsDictionary)
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            var root = System.Web.HttpContext.Current.Server.MapPath("~/UploadedDocuments");
            var provider = new MultipartFormDataStreamProvider(root);

            await Request.Content.ReadAsMultipartAsync(provider);

            var docPathes = new List<string>();

            //if (!await _pictureService.ValidatePicturesSize(provider.Contents))
            //    throw new NotImplementedException();

            foreach (MultipartFileData file in provider.FileData)
            {
                var mediaType = file.Headers.ContentType.MediaType.Substring(
                    file.Headers.ContentType.MediaType.IndexOf('/') + 1);

                var newDocumentLocalName = file.LocalFileName + "." + mediaType;

                System.IO.File.Move(file.LocalFileName, newDocumentLocalName);

                docPathes.Add(newDocumentLocalName);
            }

            foreach (var docPath in docPathes)
            {
                Microsoft.Office.Interop.Word.Applicationword = new Microsoft.Office.Interop.Word.ApplicationClass();
                // create object of missing value
                object miss = System.Reflection.Missing.Value;
                // create object of selected file path
                object path = filePath;
                // set file path mode
                object readOnly = false;
                // open document                
                Microsoft.Office.Interop.Word.Document docs = word.Documents.Open(refpath, refmiss, refreadOnly, refmiss, refmiss, refmiss, refmiss, refmiss, refmiss, refmiss, refmiss, refmiss, refmiss, refmiss, refmiss, refmiss);
                // select whole data from active window document
                docs.ActiveWindow.Selection.WholeStory();
                // handover the data to cllipboard
                docs.ActiveWindow.Selection.Copy();
                // clipboard create reference of idataobject interface which transfer the data
                IDataObject data = Clipboard.GetDataObject();
                //set data into richtextbox control in text format
                richTextBox2.Text = data.GetData(DataFormats.Text).ToString();
                // read bitmap image from clipboard with help of iddataobject interface
                Image img = (Image)data.GetData(DataFormats.Bitmap);
                // close the document
                docs.Close(refmiss, refmiss, refmiss);
            }


            return keywordsDictionary;
        }
    }
}
